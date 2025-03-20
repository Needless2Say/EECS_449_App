from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a5bd909f18bc'
down_revision = '7db7ada54a02'
branch_labels = None
depends_on = None


def upgrade():
    # Create a new temporary table without first_name and last_name
    op.create_table(
        "user_new",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.String, nullable=False, unique=True, index=True),
        sa.Column("email", sa.String, nullable=False, unique=True, index=True),
        sa.Column("hashed_password", sa.String, nullable=False),
        sa.Column("age", sa.Integer, nullable=True),
        sa.Column("gender", sa.String, nullable=True),
        sa.Column("height_cm", sa.Float, nullable=True),
        sa.Column("weight_kg", sa.Float, nullable=True),
        sa.Column("activity_level", sa.String, nullable=True),
        sa.Column("fitness_goals", sa.JSON, nullable=True),
        sa.Column("exercise_preference", sa.String, nullable=True),
        sa.Column("diet_preference", sa.String, nullable=True),
        sa.Column("allergies", sa.String, nullable=True),
        sa.Column("meal_prep_availability", sa.String, nullable=True),
        sa.Column("exercise_availability", sa.String, nullable=True),
    )

    # Copy data from the old table to the new table
    op.execute("""
        INSERT INTO user_new (
            id, username, email, hashed_password, age, gender, height_cm, weight_kg, activity_level,
            fitness_goals, exercise_preference, diet_preference, allergies, meal_prep_availability, exercise_availability
        )
        SELECT id, username, email, hashed_password, age, gender, height_cm, weight_kg, activity_level,
               fitness_goals, exercise_preference, diet_preference, allergies, meal_prep_availability, exercise_availability
        FROM user;
    """)

    # Drop the old table
    op.drop_table("user")

    # Rename the new table to "user"
    op.rename_table("user_new", "user")


def downgrade():
    # Recreate the original table (with first_name and last_name)
    op.create_table(
        "user_old",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.String, nullable=False, unique=True, index=True),
        sa.Column("email", sa.String, nullable=False, unique=True, index=True),
        sa.Column("hashed_password", sa.String, nullable=False),
        sa.Column("first_name", sa.String, nullable=False),  # Adding back first_name
        sa.Column("last_name", sa.String, nullable=False),  # Adding back last_name
        sa.Column("age", sa.Integer, nullable=True),
        sa.Column("gender", sa.String, nullable=True),
        sa.Column("height_cm", sa.Float, nullable=True),
        sa.Column("weight_kg", sa.Float, nullable=True),
        sa.Column("activity_level", sa.String, nullable=True),
        sa.Column("fitness_goals", sa.JSON, nullable=True),
        sa.Column("exercise_preference", sa.String, nullable=True),
        sa.Column("diet_preference", sa.String, nullable=True),
        sa.Column("allergies", sa.String, nullable=True),
        sa.Column("meal_prep_availability", sa.String, nullable=True),
        sa.Column("exercise_availability", sa.String, nullable=True),
    )

    # Copy data back (defaulting first_name & last_name to empty string)
    op.execute("""
        INSERT INTO user_old (
            id, username, email, hashed_password, first_name, last_name, age, gender, height_cm, weight_kg, activity_level,
            fitness_goals, exercise_preference, diet_preference, allergies, meal_prep_availability, exercise_availability
        )
        SELECT id, username, email, hashed_password, '', '', age, gender, height_cm, weight_kg, activity_level,
               fitness_goals, exercise_preference, diet_preference, allergies, meal_prep_availability, exercise_availability
        FROM user;
    """)

    # Drop the modified table
    op.drop_table("user")

    # Rename the old table back to "user"
    op.rename_table("user_old", "user")
