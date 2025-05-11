<?php

return [
  /*
   * Specify the column type used in the schema for the account ID
   *
   * Options: increments, bigIncrements, uuid, ulid
   * Default: bigIncrements
   */
  "users_table_id_column_type" => "uuid",

  /*
   * Specify the column name used as the foreign key reference for the account ID. Make sure all user tables have an ID column name that matches the one you define below.
   */
  "users_table_id_column_name" => "id",

  /*
   * Specify the column that stores the ID of the user who initially created the entry
   */
  "created_by_column" => "created_by",

  /*
   * Specify the column that holds the ID of the user who last updated the entry
   */
  "updated_by_column" => "updated_by",

  /*
   * Specify the column that contains the ID of the user who removed the entry
   */
  "deleted_by_column" => "deleted_by",

  /*
   * Indicate whether to include soft-deleted records in queries
   */
  "with_trashed" => false,
];
