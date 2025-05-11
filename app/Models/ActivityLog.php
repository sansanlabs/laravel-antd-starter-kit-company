<?php

namespace App\Models;

use App\Traits\LogsRequestData;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Spatie\Activitylog\Models\Activity;

class ActivityLog extends Activity {
  use HasUuids;
  use LogsRequestData;

  protected $fillable = ["url", "method", "ip", "agent"];

  public function scopeSearch($query, $search): mixed {
    return $query->whereAny(["description", "url", "event", "method", "ip"], "LIKE", "%$search%");
  }

  public function scopeSort($query, $column, $sort): mixed {
    if (!$column) {
      return $query->orderBy("id", "desc");
    }
    return $query->orderBy($column, $sort);
  }
}
