class AddIndexToRepoUrl < ActiveRecord::Migration
  def change
    add_index :repos, :url
  end
end
