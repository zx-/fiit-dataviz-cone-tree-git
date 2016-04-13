class HomeController < ApplicationController
  def index
  end

  def git_select
    @repo = Repo.find_by_url(par[:repo])
    if @repo.nil?
      @repo = Repo.parse_new(par[:repo])
    end

    @json_data = @repo.tree.to_json
  end

  private

  def par
    params.permit(:repo);
  end
end
