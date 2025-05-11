<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model {
  protected $keyType = "string";

  protected $hidden = ["payload"];

  public function scopeSearch($query, $search): mixed {
    return $query->whereAny(["ip_address", "user_agent"], "LIKE", "%$search%");
  }

  public function scopeSort($query, $column, $sort): mixed {
    if (!$column) {
      return $query->orderBy("user_id", "asc");
    }
    return $query->orderBy($column, $sort);
  }
}
