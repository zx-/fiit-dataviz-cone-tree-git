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

    ## generate fileList
    files = system('find . -printf "%p\n" | sed "s/^\.\///"')
    puts files


    return repo
  end


  def repo_path
    "#{Rails.root}/repos/#{id}"
  end

end