import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card'; 
import { MatChipsModule } from '@angular/material/chips';
import { LabsPage } from './labs-page';
import { LabsService } from '../../../../core/services/lab.service';
import { MatIconModule } from '@angular/material/icon';

describe('LabsPage', () => {
  let fixture: ComponentFixture<LabsPage>;
  let component: LabsPage;
  let labsService: jasmine.SpyObj<LabsService>;

  beforeEach(async () => {
    const labsServiceMock = jasmine.createSpyObj<LabsService>('LabsService', ['getAllLabs']);
    labsServiceMock.getAllLabs.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [LabsPage],
      imports: [MatCardModule, MatChipsModule, MatIconModule],
      providers: [{ provide: LabsService, useValue: labsServiceMock }],
    }).compileComponents();

    labsService = TestBed.inject(LabsService) as jasmine.SpyObj<LabsService>;
  });

  // ✅ crear componente SOLO cuando el test ya configuró el spy
  function createComponent() {
    fixture = TestBed.createComponent(LabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should initialize labs$ observable', () => {
    createComponent();
    expect(component.labs$).toBeDefined();
  });



  it('should handle error loading labs', (done) => {
    labsService.getAllLabs.and.returnValue(throwError(() => new Error('API Error')));

    createComponent();

    component.labs$.pipe(take(1)).subscribe((labs) => {
      expect(labs).toEqual([]);
      done();
    });
  });

  it('should share replay the observable to prevent multiple calls', (done) => {
    const mockLabs = [{ id: '1', code: 'LAB001', name: 'Lab 1' }];

    labsService.getAllLabs.and.returnValue(of(mockLabs as any));

    createComponent();

    // Suscribimos dos veces y comprobamos llamadas
    component.labs$.pipe(take(1)).subscribe(() => {
      component.labs$.pipe(take(1)).subscribe(() => {
        // ⚠️ si tu observable NO tiene shareReplay, esto será 2
        expect(labsService.getAllLabs.calls.count()).toBe(1);
        done();
      });
    });
  });
});
