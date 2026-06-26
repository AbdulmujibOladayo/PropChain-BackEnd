import { Injectable } from '@nestjs/common';
import { RequestRoleEscalationDto } from './dto/request-role-escalation.dto';

@Injectable()
export class RoleEscalationService {
  async requestEscalation(_userId: string, _dto: RequestRoleEscalationDto): Promise<void> {
    // TODO: implement role escalation workflow
  }
}
