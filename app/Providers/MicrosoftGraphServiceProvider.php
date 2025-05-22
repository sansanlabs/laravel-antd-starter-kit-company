<?php

namespace App\Providers;

use App\Services\Microsoft\OnBehalfOfContextUsingRefreshToken;
use Illuminate\Support\ServiceProvider;
use Microsoft\Graph\GraphServiceClient;

class MicrosoftGraphServiceProvider extends ServiceProvider {
  /**
   * Register services.
   */
  public function register(): void {
    $this->app->singleton("microsoft.graph", function (): GraphServiceClient {
      $scopes = ["https://graph.microsoft.com/.default"];

      $tokenRequestContext = new OnBehalfOfContextUsingRefreshToken(
        config("services.microsoft.tenant"),
        config("services.microsoft.client_id"),
        config("services.microsoft.client_secret"),
        assertion: session()->get("microsoft_refresh_token"),
      );

      return new GraphServiceClient($tokenRequestContext, $scopes);
    });
  }

  /**
   * Bootstrap services.
   */
  public function boot(): void {
    //
  }
}
