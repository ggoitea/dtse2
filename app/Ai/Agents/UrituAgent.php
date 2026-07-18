<?php

namespace App\Ai\Agents;

use App\Modules\Chatbot\Services\ClimaService;
use App\Modules\Chatbot\Services\LugaresService;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Laravel\Ai\Providers\Tools\FileSearch;
use Stringable;

class UrituAgent implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return config('chatbot.instructions');
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    // public function messages(): iterable
    // {
    //     return [];
    // }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            new FileSearch(stores: [
                config('chatbot.vector_store_id'),
            ]),
            new ClimaService,
            new LugaresService,
        ];
    }
}
