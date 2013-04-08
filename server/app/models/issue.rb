class Issue
  include DataMapper::Resource
  property :id,           Serial
  property :title,        String,:length=>1000
  property :status,	String
  property :link, 	String,:length=>500,   :required => true
  property :created_at,	DateTime, :required => false
  
  belongs_to :participant
  has n, :comments, :required => false
  has n, :criterias, :required => false

  def find_num_previous_comments
    return Comment.count(:issue_id=>id);
  end

  #Use helper methods to find potential participants
  def find_potential_participants

    potentials = Array.new
    potentials.concat(find_experienced_potential_participants)
    potentials.concat(find_patchsubmitter_potential_participants)
    potentials.concat(find_consensus_potential_participants)
    potentials.concat(find_recent_potential_participants)

    return potentials.sample(30)
  end
  
  #select all participants who are not participating in this thread
  def find_all_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    command = "SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid});"
    potentials = adapter.select(command)
    return potentials
  end

  def gather_participant_info_description (currentParticipant, num, recency)
    description = ""
    #Experience
    year = currentParticipant.experience/52
    yearString="years"
    week = currentParticipant.experience%52
    weekString="weeks"
    
    if(year == 1)
      yearString = "year"
    end
    if(week == 1)
      weekString = "week"
    end

    if(year>0 and week>0)
      description.concat("has #{year} #{yearString} and #{week} #{weekString} of experience")
    elsif(year>0)
      description.concat("has #{year} #{yearString} of experience")
    elsif(week>0)
      description.concat("has #{week} #{weekString} of experience")
    end

    #Patch
    patchString = "patches"
    if(currentParticipant.usabilityPatches==1)
      patchString = "patch"
    end
    description.concat(", submitted #{currentParticipant.usabilityPatches} usability #{patchString}")

    #Consensus Threads
    threadString = "threads"
    if(num==1)
      threadString = "thread"
    end
    description.concat(", participated in #{num} #{threadString} that reached consensus")

    #Recent Participation
    date2 = Time.now
    days = 0
    if(recency != 0)
      #date1 = DateTime.rfc3339(recency)
      days = recency#(date2-date1).to_f
      threadString = "days"
      if(days==1)
        threadString = "day"
      end
    end
#2013-03-14T21:44:00-05:00
    description.concat(", and participated in a thread #{days} #{threadString} ago.")

  end
  #randomly selects 10 participants between 100 experienced members who are not participating in this thread
  def find_experienced_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    res = adapter.select("SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid}) ORDER BY experience DESC;")
    potentials = Array.new
    indx = 0	
    res.each do |p_id|
      currentParticipant = Participant.first(:id=>p_id);

      currentPInfo=Hash.new
      currentPInfo["author"]=currentParticipant.user_name
      currentPInfo["authorLink"]=currentParticipant.link
      currentPInfo["description"]= gather_participant_info_description(currentParticipant, 0, 0)#Time.now)
      
      potentials.push currentPInfo
      indx = indx + 1
      break if indx == 20
    end			
    return potentials
  end

  #randomly selects 10 participants between 100 who have submitted patches
  def find_patchsubmitter_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    res = adapter.select("SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid}) ORDER BY usability_patches DESC;")
    indx = 0
    potentials = Array.new
    res.each do |p_id|
      currentParticipant = Participant.first(:id=>p_id);

      currentPInfo=Hash.new
      currentPInfo["author"]=currentParticipant.user_name
      currentPInfo["authorLink"]=currentParticipant.link
      currentPInfo["description"]= gather_participant_info_description(currentParticipant, 0, 0)#Time.now)

      potentials.push currentPInfo
      indx = indx + 1
      break if indx == 20
    end			

    return potentials#.sample(10)
  end

  #randomly selects 10 participants between 100 who create triads with current participants
  def find_triadmakers_potential_participants
  #TODO: write this function
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    res = adapter.select("SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid}) ORDER BY usability_patches DESC;")
    indx = 0
    potentials = Array.new
    res.each do |p_id|
      potentials = potentials.to_a.push p_id
      indx = indx + 1
      break if indx == 20
    end			

    return potentials#.sample(10)
  end

  

  #randomly selects 10 participants between 100 who have participated in threads that reached consensus
  def find_consensus_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    res = adapter.select("SELECT t1.participant_id, COUNT(t2.status) AS cb FROM (networks AS t1 INNER JOIN issues AS t2 ON t1.issue_id=t2.id) WHERE (t2.status LIKE 'closed%' OR t2.status LIKE 'fix%') AND t1.participant_id IN (SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid})) GROUP BY t1.participant_id ORDER BY cb DESC;")
    indx = 0
    potentials = Array.new
    res.each do |row|
      currentParticipant = Participant.first(:id=>row[0]);

      currentPInfo=Hash.new
      currentPInfo["author"]=currentParticipant.user_name
      currentPInfo["authorLink"]=currentParticipant.link
      currentPInfo["description"]= gather_participant_info_description(currentParticipant, row[1], 0)#Time.now)
      
      potentials.push currentPInfo
      indx = indx + 1
      break if indx == 20
    end			

    return potentials#.sample(10)
  end

  #randomly selects 10 participants between 100 who have RECENTLY participated in threads that reached consensus
  def find_recentconsensus_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    res = adapter.select("SELECT t1.participant_id, COUNT(t2.status) AS cb FROM (networks AS t1 INNER JOIN issues AS t2 ON t1.issue_id=t2.id) WHERE (t2.status LIKE 'closed%' OR t2.status LIKE 'fix%') AND t1.participant_id IN (SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid})) GROUP BY t1.participant_id ORDER BY t1.commented_at DESC;")
    indx = 0
    potentials = Array.new
    res.each do |row|
      currentParticipant = Participant.first(:id=>row[0]);

      currentPInfo=Hash.new
      currentPInfo["author"]=currentParticipant.user_name
      currentPInfo["authorLink"]=currentParticipant.link
      threadString = "threads"
      if(row[1]==1)
        threadString = "thread"
      end
      currentPInfo["description"]="recently participated in #{row[1]} #{threadString} that reached consensus"
      
      potentials.push currentPInfo
      indx = indx + 1
      break if indx == 20
    end			

    return potentials#.sample(10)
  end

  #randomly selects 10 participants between 100 who have RECENTLY participated in threads
  def find_recent_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    res = adapter.select("SELECT t1.participant_id, t1.commented_at FROM (networks AS t1 INNER JOIN issues AS t2 ON t1.issue_id=t2.id) WHERE t1.participant_id IN (SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid})) GROUP BY t1.participant_id ORDER BY t1.commented_at DESC;")
    indx = 0
    potentials = Array.new
    res.each do |row|
      currentParticipant = Participant.first(:id=>row[0]);

      currentPInfo=Hash.new
      currentPInfo["author"]=currentParticipant.user_name
      currentPInfo["authorLink"]=currentParticipant.link
      currentPInfo["description"]= gather_participant_info_description(currentParticipant, 0, row[1])
      
      potentials.push currentPInfo
      indx = indx + 1
      break if indx == 20
    end			

    return potentials#.sample(10)
  end

end

#inner Join: select t1.participant_id from networks as t1 inner join issues as t2 on t1.issue_id=t2.id;
#select consensus ones:  select t1.participant_id from (networks as t1 inner join issues as t2 on t1.issue_id=t2.id) where t2.status like "closed%" or t2.status like "fix%";
#select num consensus and participant id: select t1.participant_id, count(t2.status) from (networks as t1 inner join issues as t2 on t1.issue_id=t2.id) where t2.status like "closed%" or t2.status like "fix%" group by t1.participant_id;

#result: select t1.participant_id, count(t2.status) as cb from (networks as t1 inner join issues as t2 on t1.issue_id=t2.id) where (t2.status like "closed%" or t2.status like "fix%") and t1.issue_id <> 100 group by t1.participant_id order by cb desc;

#select id from participants where not exists (select participant_id, issue_id from networks where networks.participant_id=participants.id and networks.issue_id=100) into outfile './participants.txt';

