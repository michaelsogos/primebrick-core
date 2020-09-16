import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MetaView } from './entities/metaView.entity';
import { TenantRepositoryService, ContextPayload, AdvancedLogger } from 'primebrick-sdk';
import { MetaMenuItem } from './entities/MetaMenuItem.entity';
import { In, Brackets } from 'typeorm';
import { Role } from '../Auth/entities/Role.entity';
import { MetaTranslation } from './entities/MetaTranslation.entity';

@Injectable()
export class MetadataService {
    constructor(private readonly repositoryService: TenantRepositoryService, private readonly logger: AdvancedLogger) {
        logger.setContext("MetadataService")
    }

    async getAllViews(tenantAlias: string): Promise<MetaView[]> {
        const metaViewRepository = await this.repositoryService.getTenantRepository(tenantAlias, MetaView);
        return await metaViewRepository.find();
    }

    async getView(context: ContextPayload, viewName: string): Promise<MetaView> {
        try {
            const metaViewRepository = await this.repositoryService.getTenantRepository(context.tenantAlias, MetaView);
            const view = await metaViewRepository.findOneOrFail({
                where: {
                    name: viewName,
                },
                select: ['definition'],
            });
            this.logger.debug('ciccio')
            return view.definition;
        } catch (ex) {
            //TODO: @michaelsogos -> send error to logging system
            throw new InternalServerErrorException(new Error(`View [${viewName}] not found!`));
        }
    }

    async getAllMenuItems(context: ContextPayload): Promise<MetaMenuItem[]> {
        const metaMenuRepository = await this.repositoryService.getTenantRepository(context.tenantAlias, MetaMenuItem);
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
                new Brackets((qb) => {
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
