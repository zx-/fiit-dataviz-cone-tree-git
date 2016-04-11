class Repo < ActiveRecord::Base

  @@user = Octokit.user
  @@user.login

  def self.parse_new(url)
    git_repo = Octokit.repo(Octokit::Repository.from_url(url))
    clone_url = git_repo.clone_url
    repo = Repo.new url:url
    repo.save

    ## clone Repository
    val = system("git clone #{clone_url} #{Rails.root}/repos/#{repo.id}")
    return nil unless val

    ## generate ctags
    val = system("cd #{Rails.root}/repos/#{repo.id} && ctags -R -u --fields=+a+K+l+m+n+S+t")

    tags = Ctag.new "#{Rails.root}/repos/#{repo.id}/tags"


    ## generate tree
    tree = { files: [] }

    system("cd #{Rails.root}/repos/#{repo.id} "+'&& find . -printf "%p:%y\n" | sed "s/^\.\///" > ___fileList')
    File.open("#{Rails.root}/repos/#{repo.id}/___fileList").each_line do |file|
      ft = file.split(':')
      file_name = ft[0].strip
      file_type = ft[1].strip
      file_tags = tags.for_file(file_name)


      parent_node = tree
      file_tree = file_name.split('/')
      path = file_tree[0..-2]

      # traverse existing tree
      path.each { |dir| parent_node = parent_node[dir] }

      if file_type == 'd'
        parent_node[file_tree.last] = { files: [] }
      else
        parent_node[:files] << {
            name: file_tree.last,
            tags: file_tags
        }
      end

    end
    repo.tree = tree
    repo.save

    puts tree

    return repo
  end


  def repo_path
    "#{Rails.root}/repos/#{id}"
  end

end