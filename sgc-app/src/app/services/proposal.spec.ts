import { TestBed } from '@angular/core/testing';
import { ProposalService } from './proposal.service';


describe('Proposal', () => {
  let service: ProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
