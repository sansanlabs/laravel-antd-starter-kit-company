<?php

namespace App\Models;

use SanSanLabs\Userstamps\Concerns\HasUserstamps;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole {
  use HasUserstamps;
  use LogsActivity;

  protected $fillable = ["name", "description", "guard_name"];

  public function getActivitylogOptions(): LogOptions {
    return LogOptions::defaults()
      ->logAll()
      ->logOnlyDirty()
      ->useLogName("roles")
      ->setDescriptionForEvent(fn(string $eventName) => "{$eventName} role (:subject.name)");
  }

  public function scopeSearch($query, $search): mixed {
    return $query->whereAny(["name", "description"], "LIKE", "%$search%");
  }

  public function scopeSort($query, $column, $sort): mixed {
    if (!$column) {
      return $query->orderBy("id", "asc");
    }
    return $query->orderBy($column, $sort);
  }
}
