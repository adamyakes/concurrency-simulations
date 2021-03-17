import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { appTitle } from '../constants';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  problems: {title: string; link: string}[] = [
    {
      title: 'Dining Philosophers',
      link: 'https://greenteapress.com/semaphores/LittleBookOfSemaphores.pdf#section.4.4',
    },
    {
      title: 'Readers & Writers',
      link: 'https://greenteapress.com/semaphores/LittleBookOfSemaphores.pdf#section.4.2',
    },
    {
      title: 'Bounded Buffer',
      link: 'https://greenteapress.com/semaphores/LittleBookOfSemaphores.pdf#section.4.1'
    },
    {
      title: 'Unisex Bathroom',
      link: 'https://greenteapress.com/semaphores/LittleBookOfSemaphores.pdf#section.6.2'
    },
  ];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(appTitle);
  }

}
