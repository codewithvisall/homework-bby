<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'jwt.auth' => \PHPOpenSourceSaver\JWTAuth\Http\Middleware\Authenticate::class,
            'jwt.refresh' => \PHPOpenSourceSaver\JWTAuth\Http\Middleware\RefreshToken::class,
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontReport(\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException::class);
        $exceptions->dontReport(\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException::class);
        $exceptions->dontReport(\PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException::class);

        $exceptions->render(function (\Throwable $e) {
            $request = request();
            if ($request->is('api/*') || $request->wantsJson()) {
                $status = match (true) {
                    $e instanceof \PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException => Response::HTTP_UNAUTHORIZED,
                    $e instanceof \PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException => Response::HTTP_UNAUTHORIZED,
                    $e instanceof \PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException => Response::HTTP_UNAUTHORIZED,
                    default => Response::HTTP_INTERNAL_SERVER_ERROR,
                };

                return new JsonResponse([
                    'message' => $e->getMessage(),
                    'status' => $status,
                ], $status);
            }
            return null;
        });
    })->create();
