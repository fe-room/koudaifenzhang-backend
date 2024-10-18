![alt text](image.png)

根据上面提供的流程图，可以设计以下数据库表来支持记账系统的功能。表的设计主要围绕账本（单人、多人的分类）、账本共享人员、分账类型（AA或按详细比例）等几个核心功能。

### 1. `account_books` 表
用于存储账本的基本信息，包括账本类型（单人账本、多人账本）。

| 字段名             | 数据类型            | 说明                  |
|------------------|-----------------|---------------------|
| `id`             | `BIGINT`        | 主键，账本ID           |
| `name`           | `VARCHAR(255)`  | 账本名称               |
| `type`           | `ENUM('single', 'group')` | 账本类型，单人或多人      |
| `created_by`     | `BIGINT`        | 创建人ID             |
| `created_at`     | `DATETIME`      | 创建时间               |
| `updated_at`     | `DATETIME`      | 更新时间               |

### 2. `account_book_members` 表
存储多人账本的共享成员信息。

| 字段名             | 数据类型          | 说明                    |
|------------------|---------------|-----------------------|
| `id`             | `BIGINT`      | 主键，成员ID             |
| `account_book_id`| `BIGINT`      | 所属账本的ID             |
| `user_id`        | `BIGINT`      | 成员的用户ID             |
| `invitation_type`| `ENUM('manual', 'wechat')` | 邀请类型（手动或微信邀请） |
| `joined_at`      | `DATETIME`    | 成员加入时间              |

### 3. `transactions` 表
用于记录每一笔账目的详细信息，包括账本类型和分账类型。

| 字段名             | 数据类型            | 说明                       |
|------------------|-----------------|--------------------------|
| `id`             | `BIGINT`        | 主键，交易ID                |
| `account_book_id`| `BIGINT`        | 所属账本的ID                |
| `amount`         | `DECIMAL(10, 2)`| 交易金额                    |
| `description`    | `TEXT`          | 交易描述                    |
| `transaction_type` | `ENUM('single', 'group')` | 账本类型，单人或多人           |
| `split_type`     | `ENUM('aa', 'detailed')` | 分账类型（AA或按比例）         |
| `created_by`     | `BIGINT`        | 创建交易的用户ID             |
| `created_at`     | `DATETIME`      | 交易创建时间                 |

### 4. `transaction_splits` 表
存储每笔交易的详细分账信息，适用于多人账本。

| 字段名             | 数据类型            | 说明                       |
|------------------|-----------------|--------------------------|
| `id`             | `BIGINT`        | 主键，分账记录ID             |
| `transaction_id` | `BIGINT`        | 所属交易的ID                |
| `user_id`        | `BIGINT`        | 分账的用户ID                 |
| `paid_amount`    | `DECIMAL(10, 2)`| 用户在此交易中支付的金额       |
| `owed_amount`    | `DECIMAL(10, 2)`| 用户应分摊的金额       |
| `share_ratio`    | `DECIMAL(5, 2)` | 共享比例（仅在按比例分账时适用）  |

### 5. `users` 表
用于存储用户信息。

| 字段名             | 数据类型          | 说明                       |
|------------------|---------------|--------------------------|
| `id`             | `BIGINT`      | 主键，用户ID                |
| `openId`         | `VARCHAR(255)`| 唯一标识，微信用户ID          |
| `unionId`        | `VARCHAR(255)`| 主键，用户ID                |
| `nickname`       | `VARCHAR(255)`| 用户昵称                    |
| `avatarUrl`       | `VARCHAR(255)`| 用户头像                   |
| `createdAt`     | `DATETIME`    | 用户创建时间                 |
| `updatedAt`     | `DATETIME`    | 用户创建时间                 |


### 表之间的关系
- `account_books` 表与 `account_book_members` 表是一对多的关系。
- `account_books` 表与 `transactions` 表是一对多的关系。
- `transactions` 表与 `transaction_splits` 表是一对多的关系。
- `users` 表与 `account_book_members` 表、`transactions` 表和 `transaction_splits` 表之间都是多对一的关系。

这种数据库设计可以支持流程图中涉及的各种操作，包括创建账本、添加共享成员、记录和分配费用等。