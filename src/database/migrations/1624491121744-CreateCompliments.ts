import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompliments1624491121744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'compliments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'sender_id',
            type: 'uuid',
          },
          {
            name: 'receiver_id',
            type: 'uuid',
          },
          {
            name: 'tag_id',
            type: 'uuid',
          },
          {
            name: 'message',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FKUserSenderCompliments',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['sender_id'],
            onUpdate: 'SET NULL',
            onDelete: 'SET NULL',
          },
          {
            name: 'FKUserReceiverCompliments',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['receiver_id'],
            onUpdate: 'SET NULL',
            onDelete: 'SET NULL',
          },
          {
            name: 'FKTagCompliments',
            referencedTableName: 'tags',
            referencedColumnNames: ['id'],
            columnNames: ['tag_id'],
            onUpdate: 'SET NULL',
            onDelete: 'SET NULL',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('compliments');
  }
}
