#lib/tasks/import-issue.rake
desc "Prepopulate the Issue table"
task :csv_issue_import => :environment do 
  lines = File.new("attributes-issue.txt").readlines
  lines.each do |line|
	values = line.strip.split("\t")
	part = Participant.first({:user_name =>values[14]})
	if(part == nil)
		part = Participant.first_or_create({:user_name =>"Anonymous"});
	end			 
	Issue.first_or_create({:link => values[1]},{:status =>values[10],:participant=>part, :title => values[13]})
	puts values[1] + " " + values [14] + " " + values[10] + " " + values[13] + " "
  end

end

