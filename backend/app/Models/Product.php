<?php

namespace App\Models;

use App\Events\ProductEvent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'qty'];

    protected $dispatchesEvents = [
        'created' => ProductEvent::class,
        'updated' => ProductEvent::class,
        'deleted' => ProductEvent::class,
    ];
}
