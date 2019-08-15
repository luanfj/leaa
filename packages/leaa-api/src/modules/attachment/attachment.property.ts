import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/entrys';
import { pathUtil } from '@leaa/api/utils';
import { attachmentConfig } from '@leaa/api/configs';

// const CONSTRUCTOR_NAME = 'AttachmentProperty';

@Injectable()
export class AttachmentProperty {
  constructor(@InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>) {}

  resolvePropertyUrl(attachment: Pick<Attachment, 'in_oss' | 'in_local' | 'path'>): string | null {
    if (attachment.in_oss) {
      return `${attachmentConfig.URL_PREFIX_BY_OSS}${attachment.path}`;
    }

    if (attachment.in_local) {
      return `${attachmentConfig.URL_PREFIX_BY_LOCAL}${attachment.path}`;
    }

    return null;
  }

  resolvePropertyUrlAt2x(attachment: Attachment): string | null {
    if (attachment.at2x) {
      return pathUtil.getAt2xPath(this.resolvePropertyUrl(attachment));
    }

    return null;
  }
}
