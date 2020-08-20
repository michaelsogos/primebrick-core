import { Injectable } from '@nestjs/common';
import { MetaView } from './entities/metaView.entity';
import { TenantRepositoryService, ContextPayload } from 'primebrick-sdk';
import { MetaMenuItem } from './entities/MetaMenuItem.entity';
import { In, Brackets } from 'typeorm';
import { Role } from '../Auth/entities/Role.entity';
import { MetaTranslation } from './entities/MetaTranslation.entity';

@Injectable()
export class MetadataService {
    constructor(private readonly repositoryService: TenantRepositoryService) {
        Reflect.defineMetadata('path', 'api/meta', this);
        Reflect.defineMetadata('__routeArguments__', { pipe: 'f' }, this, 'asd');
    }

    async getAllViews(tenantAlias: string): Promise<MetaView[]> {
        const metaViewRepository = await this.repositoryService.getTenantRepository(tenantAlias, MetaView);
        return await metaViewRepository.find();
    }

    async saveNewMetaView(tenantAlias: string): Promise<void> {
        const metaViewRepository = await this.repositoryService.getTenantRepository(tenantAlias, MetaView);
        const newMetaView: MetaView = metaViewRepository.create();
        newMetaView.name = 'dfdfd';
        newMetaView.definition = { a: 1 };
        await metaViewRepository.save(newMetaView);

        const firstMetaView = await metaViewRepository.findOne(1);
        firstMetaView.name = 'a1232244CCCBLA';
        await metaViewRepository.save(firstMetaView);
    }

    async getAllMenuItems(tenantAlias: string): Promise<MetaMenuItem[]> {
        const metaMenuRepository = await this.repositoryService.getTenantRepository(tenantAlias, MetaMenuItem);
        const treeRepostory = metaMenuRepository.manager.getTreeRepository(MetaMenuItem);
        return await treeRepostory.findTrees();
    }

    async getMenuItems(context: ContextPayload): Promise<MetaMenuItem[]> {
        const roleRepository = await this.repositoryService.getTenantRepository(context.tenantAlias, Role);
        const roles = await roleRepository.find({
            relations: ['menuItems'],
            where: {
                name: In([...context.userProfile.roles]),
            },
        });

        const metaMenuRepository = await this.repositoryService.getTenantRepository(context.tenantAlias, MetaMenuItem);

        const treeRepostory = metaMenuRepository.manager.getTreeRepository(MetaMenuItem);

        const result: MetaMenuItem[] = [];
        for (const role of roles) {
            for (const menu of role.menuItems) {
                result.push(await treeRepostory.findDescendantsTree(menu));
            }
        }

        return result;
    }

    async getTranslations(group: string, context: ContextPayload): Promise<MetaTranslation[]> {
        const translationRepository = await this.repositoryService.getTenantRepository(context.tenantAlias, MetaTranslation);
        const query = translationRepository.createQueryBuilder('t');

        if (group) query.where('t.group = :group', { group: group });
        else {
            query.where(
                new Brackets(qb => {
                    qb.where('t.group is null');
                    qb.orWhere('t.group = :group', { group: '' });
                }),
            );
        }
        query.andWhere('t.languageCode = :languageCode', { languageCode: context.languageCode });

        query.select(['t.isTemplate', 't.key', 't.value']);

        const translations = await query.getMany();

        return translations;
    }
}
