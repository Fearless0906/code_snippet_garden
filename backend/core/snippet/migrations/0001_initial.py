# Generated by Django 5.2 on 2025-04-23 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CodeSnippet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('language', models.CharField(max_length=50)),
                ('summary', models.TextField()),
                ('snippet', models.TextField()),
                ('tags', models.JSONField(default=list)),
                ('difficulty_level', models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], default='beginner', max_length=12)),
            ],
            options={
                'ordering': ['title'],
            },
        ),
    ]
