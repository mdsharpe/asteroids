import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, map } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
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

        debugger;
        localStorage.setItem('playerName', this.name$.value);
    }
}
