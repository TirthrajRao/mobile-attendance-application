import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogSummaryPage } from './log-summary.page';

describe('LogSummaryPage', () => {
  let component: LogSummaryPage;
  let fixture: ComponentFixture<LogSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogSummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
