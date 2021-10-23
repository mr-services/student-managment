import { Component, OnInit } from '@angular/core';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    public onlineOffline: boolean = navigator.onLine;
    /**
     * Constructor
     */
    constructor()
    {
    }

    ngOnInit(): void {
        this.createOnline().subscribe((onlineOffline) => {
            console.log('check con, ', onlineOffline);
        });
    }

    public createOnline(): Observable<any> {
        return merge<boolean>(
            fromEvent(window, 'offline').pipe(map(() => false)),
            fromEvent(window, 'online').pipe(map(() => true)),
            new Observable((sub: Observer<boolean>) => {
                sub.next(navigator.onLine);
                sub.complete();
            }));
    }
}
