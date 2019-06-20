using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ninject;
using Ninject.Activation;
using Ninject.Infrastructure.Disposal;
using SpotifyStats.NInjectConfiguration;
using SpotifyStats.Services;


namespace SpotifyStats
{
  public class Startup
  {
    private readonly AsyncLocal<Scope> _scopeProvider = new AsyncLocal<Scope>();
    private IKernel Kernel { get; set; }

    private object Resolve(Type type) => Kernel.Get(type);
    private object RequestScope(IContext context) => _scopeProvider.Value;


    public Startup(IHostingEnvironment env)
    {
      var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json",
          optional: false,
          reloadOnChange: true)
        .AddJsonFile("appsettings.Secrets.json",
          optional: false,
          reloadOnChange: false)
        .AddEnvironmentVariables();

      // ReSharper disable once ConvertIfStatementToConditionalTernaryExpression
      if (env.IsDevelopment())
      {
        builder.AddJsonFile("appsettings.Development.json");
      }
      else
      {
        builder.AddJsonFile("appsettings.Production.json");
      }

      Configuration = builder.Build();
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
      services.AddCors(options => {
        options.AddPolicy("AllowAny",
          builder => {
            builder.AllowAnyOrigin();
            builder.AllowAnyMethod();
            builder.AllowAnyHeader();
          }
        );
      });

      services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
      services.AddRequestScopingMiddleware(() => _scopeProvider.Value = new Scope());
      services.AddCustomControllerActivation(Resolve);
      services.AddCustomViewComponentActivation(Resolve);

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      Kernel = RegisterApplicationComponents(app, loggerFactory);

      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseHsts();
      }

      app.UseHttpsRedirection();
      app.UseMvc();
      app.UseCors();
    }

    private IKernel RegisterApplicationComponents(
      IApplicationBuilder app, ILoggerFactory loggerFactory)
    {
      Kernel = new StandardKernel();

      // Register application services
      foreach (var ctrlType in app.GetControllerTypes())
      {
        Kernel.Bind(ctrlType).ToSelf().InScope(RequestScope);
      }

      Kernel.Bind<ISpotifyAuthService>().To<SpotifyAuthService>().InSingletonScope();
      Kernel.Bind<ISpotifyLibraryService>().To<SpotifyLibraryService>().InSingletonScope();

      // Cross-wire required framework services
      Kernel.BindToMethod(app.GetRequestService<IViewBufferScope>);
      Kernel.Bind<ILoggerFactory>().ToConstant(loggerFactory);
      Kernel.Bind<IConfiguration>().ToConstant(Configuration);

      return Kernel;
    }

    private sealed class Scope : DisposableObject { }

  }

  public static class BindingHelpers
  {
    public static void BindToMethod<T>(this IKernel config, Func<T> method) =>
      config.Bind<T>().ToMethod(c => method());
  }
}
