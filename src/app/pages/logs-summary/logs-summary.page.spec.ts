import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogsSummaryPage } from './logs-summary.page';

describe('LogsSummaryPage', () => {
  let component: LogsSummaryPage;
  let fixture: ComponentFixture<LogsSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsSummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogsSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
