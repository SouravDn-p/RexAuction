import React, { useState } from "react";
import { ChevronDown, Crown } from 'lucide-react';

function CaseBattle() {
  // Mock data based on the image
  const caseBattles = [
    {
      id: "1",
      rounds: 5,
      cases: [
        { id: "1", image: "/placeholder.svg", multiplier: "x1" },
        { id: "2", image: "/placeholder.svg", multiplier: "x1" },
        { id: "3", image: "/placeholder.svg", multiplier: "x1" },
        { id: "4", image: "/placeholder.svg", multiplier: "x1" },
        { id: "5", image: "/placeholder.svg", multiplier: "x1" },
      ],
      value: 51.8,
      players: [
        { id: "1", avatar: "/placeholder.svg" },
        { id: "2", avatar: "/placeholder.svg" },
      ],
      hasJoinButton: false,
    },
    {
      id: "2",
      rounds: 1,
      cases: [{ id: "1", image: "/placeholder.svg", multiplier: "x1" }],
      value: 0.25,
      players: [{ id: "1", avatar: "/placeholder.svg" }],
      hasJoinButton: true,
    },
    {
      id: "3",
      rounds: 10,
      cases: [
        { id: "1", image: "/placeholder.svg", multiplier: "x1" },
        { id: "2", image: "/placeholder.svg", multiplier: "x3" },
        { id: "3", image: "/placeholder.svg", multiplier: "x5" },
        { id: "4", image: "/placeholder.svg", multiplier: "x1" },
      ],
      value: 3.59,
      players: [{ id: "1", avatar: "/placeholder.svg" }],
      hasJoinButton: true,
    },
    {
      id: "4",
      rounds: 1,
      cases: [{ id: "1", image: "/placeholder.svg", multiplier: "x1" }],
      value: 0.35,
      players: [{ id: "1", avatar: "/placeholder.svg" }],
      hasJoinButton: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header with column titles */}
        {/* <div className="grid grid-cols-5 gap-4 mb-4 border-b border-gray-800 pb-2">
          <div className="flex items-center text-gray-400 text-sm">
            Rounds <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="text-gray-400 text-sm">Cases</div>
          <div className="flex items-center text-gray-400 text-sm">
            Value <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            Players <ChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="text-gray-400 text-sm text-right">Actions</div>
        </div> */}

        {/* Battle rows */}
        <div className="space-y-6">
          {caseBattles.map((battle) => (
            <div key={battle.id} className="grid grid-cols-5 gap-4 items-center py-4">
              {/* Rounds */}
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                    battle.rounds >= 10 ? "bg-purple-900" : "bg-green-900"
                  }`}
                >
                  {battle.rounds >= 5 && (
                    <Crown className="absolute -top-2 -left-1 h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-lg font-bold">{battle.rounds}</span>
                </div>
              </div>

              {/* Cases */}
              <div className="flex space-x-1">
                {battle.cases.map((caseItem) => (
                  <div key={caseItem.id} className="relative">
                    <div className="w-14 h-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={caseItem.image || "/placeholder.svg"}
                        alt={`Case ${caseItem.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute top-0 left-0 text-xs font-bold px-1 bg-gray-800">
                      {caseItem.multiplier}
                    </span>
                  </div>
                ))}
              </div>

              {/* Value */}
              <div>
                <p className="text-lg font-bold text-green-500">$ {battle.value.toFixed(2)}</p>
              </div>

              {/* Players */}
              <div className="flex -space-x-2">
                {battle.players.map((player) => (
                  <div key={player.id} className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-800">
                    <img
                      src={player.avatar || "/placeholder.svg"}
                      alt={`Player ${player.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {battle.players.length < 4 &&
                  Array.from({ length: 4 - battle.players.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center"
                    >
                      <span className="text-white text-lg">+</span>
                    </div>
                  ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 justify-end">
                <button className="bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 px-4 py-2 rounded">
                  WATCH
                </button>
                {battle.hasJoinButton && (
                  <button className="bg-yellow-600 hover:bg-yellow-500 text-white border-none px-4 py-2 rounded flex items-center">
                    <Crown className="h-4 w-4 mr-2" />
                    JOIN
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CaseBattle;