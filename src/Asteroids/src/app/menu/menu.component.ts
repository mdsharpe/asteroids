import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
    constructor(private readonly _router: Router) { }

    public readonly name$ = new BehaviorSubject('');

    public canJoin$ = this.name$.pipe(map(name => !!name));

    ngOnInit(): void {
        this.name$.subscribe(console.log);

        const storedName = localStorage.getItem('playerName');
        if (storedName) {
            this.name$.next(storedName);
        }
    }

    public joinGame(): void {
        if (!this.name$.value) {
            return;
        }

        localStorage.setItem('playerName', this.name$.value);
        this._router.navigateByUrl('play');
    }
}
