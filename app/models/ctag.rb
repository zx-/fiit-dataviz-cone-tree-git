require "csv"

class Ctag
  def initialize(file)
    @tags = {}

    tags = File.readlines(file)
    tags.drop(6).each do |tag|
      attrs = tag.split("\t")

      file_path = attrs[1]
      @tags[file_path] = [] if @tags[file_path].nil?

      @tags[file_path] << {
          name: attrs[0],
          def: attrs[2],
          type: attrs[3],
          line: attrs[4].split(':')[1].to_i,
          language: attrs[5].split(':')[1].strip,
          info: attrs[6]&.strip
      }
    end

    @tags.values do |tags|
      tags.sort_by! &:line
    end
  end

  def for_file(file_path)
    @tags[file_path]
  end
end