<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class MicrosoftGraph extends Facade {
  protected static function getFacadeAccessor(): string {
    return "microsoft.graph";
  }
}
