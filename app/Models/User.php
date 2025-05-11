<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use SanSanLabs\Userstamps\Concerns\HasUserstamps;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable {
  use HasFactory;
  use HasRoles;
  use HasUuids;
  use HasUserstamps;
  use LogsActivity;
  use Notifiable;
  use SoftDeletes;

  protected $fillable = ["microsoft_id", "name", "email", "password"];

  protected $hidden = ["password", "remember_token"];

  protected function casts(): array {
    return [
      "email_verified_at" => "datetime",
      "password" => "hashed",
    ];
  }

  public function getActivitylogOptions(): LogOptions {
    return LogOptions::defaults()
      ->logAll()
      ->logOnlyDirty()
      ->useLogName("users")
      ->setDescriptionForEvent(fn(string $eventName) => "{$eventName} user (:subject.name)");
  }

  public function scopeSearch($query, $search): mixed {
    return $query->whereAny(["name", "email"], "LIKE", "%$search%");
  }

  public function scopeSort($query, $column, $sort): mixed {
    if (!$column) {
      return $query->orderBy("name", "asc");
    }
    return $query->orderBy($column, $sort);
  }
}
