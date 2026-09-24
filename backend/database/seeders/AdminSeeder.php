<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Create/update the live admin from .env:
     * ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
     *
     * Production defaults match .env.production.example.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@sunbirdvacations.com');
        $password = env('ADMIN_PASSWORD');
        $name = env('ADMIN_NAME', 'Sunbird Admin');

        if (! $password) {
            if ($this->command) {
                $this->command->warn('ADMIN_PASSWORD is not set — skipping AdminSeeder.');
            }

            return;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'is_admin' => true,
            ]
        );

        if (! $user->is_admin) {
            $user->is_admin = true;
            $user->save();
        }
    }
}
