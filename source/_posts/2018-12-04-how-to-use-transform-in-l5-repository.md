---
layout:         post
title:          '如何在 l5-repository 中使用 transform'
excerpts:       ''
---

## 在 Laravel 中使用

安装好 `l5-repository` 包后，在 `config/app.php` 中把下面代码添加到 `providers` 中：

```php
'providers' => [
    \\ ...
    Prettus\Repository\Providers\RepositoryServiceProvider::class,
],
```

然后在命令行中发布配置：

```sh
php artisan vendor:publish --provider "Prettus\Repository\Providers\RepositoryServiceProvider"
```

发布配置之后，就可以利用命令 `php artisan make:entity xxx` 来发布 `entity` 了，比如发布 `Post` 实体为例：

```sh
php artisan make:entity Post
```

就会在项目中生成模型、控制器等相关文件。

## 启用 l5-repository 的字段转换功能

`transform` 的配置文件在 `app\Transformers` 目录中，把需要转换的字段填到对应转换文件中的 `transform` 函数中，例如：

```php
public function transform(Post $post)
{
    return [
        'id' => (int) $post->id,
        'title' => $post->title,
        'content' => $post->content,
        'createdAt' => $post->created_at,
        'updatedAt' => $post->updated_at
    ];
}
```

注意，此时配置完转换文件后，并不会生效，还需要在 `PostRepositoryEloquent` 中「启用展示」才会生效：

```php
use App\Presenters\PostPresenter;

class PostRepositoryEloquent extends BaseRepository implements PostRepository
{
    public function presenter()
    {
        return PostPresenter::class;
    }
}
```
