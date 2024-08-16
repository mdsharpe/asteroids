import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { GameState } from "./game-state";

@Injectable()
export class GameStateService {
    private readonly _gameState = new BehaviorSubject<GameState>(new GameState());

    public readonly state = this._gameState.asObservable();
}
