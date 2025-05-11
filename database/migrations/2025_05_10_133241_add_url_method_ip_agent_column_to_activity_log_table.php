<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::connection(config("activitylog.database_connection"))->table(config("activitylog.table_name"), function (Blueprint $table): void {
      $table->text("url")->nullable()->after("properties");
      $table->string("method")->nullable()->after("url");
      $table->text("ip")->nullable()->after("method");
      $table->text("agent")->nullable()->after("ip");
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    Schema::connection(config("activitylog.database_connection"))->table(config("activitylog.table_name"), function (Blueprint $table): void {
      $table->dropColumn("url");
      $table->dropColumn("method");
      $table->dropColumn("ip");
      $table->dropColumn("agent");
    });
  }
};
