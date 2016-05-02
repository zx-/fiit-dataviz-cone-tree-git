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


  def show_file
    @file = Repo.find_by_id(par[:repo]).show_file(par[:path].gsub(/\/\//,'.'))
  end

  private

  def par
    params.permit(:repo,:path,:format);
  end
end
