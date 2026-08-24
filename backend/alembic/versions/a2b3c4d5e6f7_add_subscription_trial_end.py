"""add subscription trial end timestamp

Revision ID: a2b3c4d5e6f7
Revises: f1a2b3c4d5e6
Create Date: 2026-08-24
"""
from alembic import op
import sqlalchemy as sa

revision = "a2b3c4d5e6f7"
down_revision = "f1a2b3c4d5e6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("subscriptions", sa.Column("trial_ends_at", sa.DateTime(timezone=True), nullable=True))
    op.execute(
        sa.text(
            "UPDATE subscriptions "
            "SET trial_ends_at = created_at + INTERVAL '3 days' "
            "WHERE status = 'trialing' AND trial_ends_at IS NULL"
        )
    )


def downgrade() -> None:
    op.drop_column("subscriptions", "trial_ends_at")
