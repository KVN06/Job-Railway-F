<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_token(): void
    {
        $payload = [
            'name' => 'Nuevo Usuario',
            'email' => 'nuevo@example.com',
            'password' => 'Secret123',
            'password_confirmation' => 'Secret123',
            'user_type' => 'company',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'type',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'nuevo@example.com',
            'type' => 'company',
        ]);
    }

    public function test_user_can_login_and_get_token(): void
    {
        $user = User::factory()->create([
            'email' => 'person@example.com',
            'password' => Hash::make('Secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'person@example.com',
            'password' => 'Secret123',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'type',
                ],
            ])
            ->assertJsonPath('user.id', $user->id);
    }

    public function test_authenticated_user_can_fetch_profile_and_logout(): void
    {
        $user = User::factory()->create([
            'type' => 'company',
        ]);

        $token = $user->createToken('mobile')->plainTextToken;

        $meResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/me');

        $meResponse
            ->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', $user->email);

        $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout');

        $logoutResponse
            ->assertOk()
            ->assertJson([
                'message' => 'Sesión cerrada correctamente.',
            ]);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name' => 'mobile',
        ]);
    }
}
