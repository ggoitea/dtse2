<?php

namespace App\Providers;

use App\Enums\Permission;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->registerGateBefore();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(5)
                // ->mixedCase()
                    ->letters()
                    ->numbers()
                // ->symbols()
                // ->uncompromised()
                : null,
        );
    }

    /**
     * Register the Gate::before callback before package providers boot.
     * This ensures it runs before spatie/laravel-permission registers its own Gate::before.
     */
    protected function registerGateBefore(): void
    {
        /** @var Permission[] $OwnerIgnoresPermissions */
        $OwnerIgnoresPermissions = config('permission.OwnerIgnoresPermissions', []);

        Gate::before(function (User $user, string $ability) use ($OwnerIgnoresPermissions): ?bool {

            if ($user->hasRole('owner') && ! in_array($ability, array_map(fn (Permission $p) => $p->value, $OwnerIgnoresPermissions))) {
                return true;
            }

            return null;
        });
    }
}
