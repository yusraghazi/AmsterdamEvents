import { Component, OnInit } from '@angular/core';
import {AEvent} from "../../../models/a-event";
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {AEventsSbService} from "../../../services/a-events-sb.service";

@Component({
  selector: 'app-overview5',
  templateUrl: './overview5.component.html',
  styleUrls: ['./overview5.component.css']
})
export class Overview5Component implements OnInit {

  displayedColumns: string[] = ['title'];
  HighlightRow: number;
  selectedAEvent: AEvent;


  constructor(private aEventService: AEventsSbService, private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.checkForParams();
    if (this.selectedAEvent == null){
      this.onUnSelect()
    }
  }

  checkForParams(){
    this.activatedRoute.firstChild.params.subscribe((params: Params) => {
      this.selectedAEvent = this.aEventService.findById(params['id']);
      for (let i = 0; i < this.aEvents.length; i++) {
        if (this.aEvents[i] == this.selectedAEvent) {
          this.HighlightRow = i;
        }
      }
    });
  }

  addEvent() {
    let newAEvent : AEvent =  AEvent.createSampleAEvent(0);
    let savedAEvent = new AEvent();
    this.aEventService.addRandomAEvent(newAEvent).subscribe(
       (data) => {
        savedAEvent = data;
         this.selected(savedAEvent);

      }
      ,
      (error)=>{
        console.log('HTTP Error: Status ' +
          error.status + ' - ' + error.message)
      }
    );
  }

  async selected( aEvent: AEvent) {
    if (aEvent != null && aEvent.id !== this.selectedAEvent?.id) {
      await this.aEventService.loadAEvents();
      await this.router.navigate([  aEvent.id], {relativeTo: this.activatedRoute})
      this.selectedAEvent = aEvent;
      this.HighlightRow = this.aEvents.indexOf(aEvent);
    } else {
      this.onUnSelect()
    }
  }

  onSave(aEvent: AEvent) {
    this.aEventService.save(aEvent);
  }

 get aEvents(): AEvent[] {
    return this.aEventService.findAll()
  }


  onUnSelect() {
    this.router.navigate(['/events/overview5'], {relativeTo: this.activatedRoute})
    this.selectedAEvent = null;
    this.HighlightRow = null;
  }
}
