export type NavChild = { label: string; href: string };
export type NavLink = { label: string; href: string; children?: NavChild[] };

// All image fields default to "" — the client uploads real assets via /admin.
// Avoid broken <img> tags in pages by rendering an empty-state placeholder.
const M = (key: string) => `/media/site-content/${key}`;

export const DEFAULT_CONTENT: Record<string, any> = {
	navbar: {
		logoText: "TTC & SOGY",
		logoSub: "Youth Development Charity",
		logoUrl: "",
		links: [
			{ label: "Home", href: "/" },
			{
				label: "About Us",
				href: "/about",
				children: [
					{ label: "Who We Are", href: "/about#who-we-are" },
					{ label: "Our History", href: "/about#history" },
					{ label: "Vision, Mission & Values", href: "/about#mission" },
					{ label: "Leadership & Governance", href: "/about#leadership" },
				],
			},
			{
				label: "What We Do",
				href: "/what-we-do",
				children: [
					{ label: "Conferences", href: "/what-we-do#conferences" },
					{ label: "School Outreach", href: "/what-we-do#outreach" },
					{ label: "Mentorship & Leadership", href: "/what-we-do#mentorship" },
					{ label: "Skills & Enterprise", href: "/what-we-do#skills" },
					{ label: "Christian Discipleship", href: "/what-we-do#discipleship" },
				],
			},
			{ label: "Our Impact", href: "/impact" },
			{
				label: "Our Future",
				href: "/future",
				children: [
					{ label: "TTC Global Institute", href: "/future#institute" },
					{ label: "Talent Hubs", href: "/future#talent-hubs" },
				],
			},
			{
				label: "Get Involved",
				href: "/get-involved",
				children: [
					{ label: "Donate", href: "/get-involved#donate" },
					{ label: "Partner With Us", href: "/get-involved#partner" },
					{ label: "Volunteer", href: "/get-involved#volunteer" },
					{ label: "Global Ambassadors", href: "/get-involved#ambassadors" },
				],
			},
			{ label: "Contact", href: "/contact" },
		],
		ctaOrange: "Donate",
		ctaBlue: "Get Involved",
	},

	branding: {
		favicon: "",
		headerLogo: "",
		footerLogo: "",
		adminLogo: "",
	},

	seo: {
		title: "TTC & SOGY | Christ-Centred Youth Development Charity",
		description:
			"Turn To Christ Commission & Streets of Gold Youth Conference — a Christian youth development charity raising purposeful, skilled and Christ-centred global leaders.",
		keywords:
			"youth development, christian charity, ttc, sogy, youth conference, mentorship, leadership, discipleship, youth empowerment",
		ogImage: "",
	},

	// --------------------------------------------------------------------
	// HOME
	// --------------------------------------------------------------------
	home: {
		hero: {
			title: "Raising a Generation of Purposeful, Skilled and Christ-Centred Global Leaders",
			quote: "“Let no one despise your youth, but be an example…” — 1 Timothy 4:12",
			intro:
				"Turn To Christ Commission and Streets of Gold Youth Conference (TTC & SOGY) is a Christian youth development charity committed to transforming young lives through faith, education, leadership, mentorship, wellbeing, creativity and practical skills.",
			ctaButtons: ["Discover Our Work", "Partner With Us", "Support a Young Person"],
			imageUrl: M("1787955708700-group.jpg"),
		},
		intro: {
			heading: "Every Young Person Has God-Given Potential",
			text: "Yet many lack the guidance, opportunities, skills and supportive relationships needed to turn that potential into purpose and impact. TTC & SOGY exists to bridge that gap through Christian outreach, school and community programmes, conferences, mentorship, leadership development and practical learning.\n\nSince our public launch in Ghana in 2022, our programmes have reportedly reached more than 13,000 young people in Ghana and the United Kingdom.",
			imageUrl: M("1787955736423-loc.jpg"),
			stats: [
				{ label: "Young People Reached", value: "13,000+" },
				{ label: "Countries Connected", value: "8+" },
				{ label: "Since", value: "2022" },
			],
		},
		pillars: {
			title: "Our Four Strategic Pillars",
			subtitle:
				"Everything we do is built on four interconnected pillars that develop the whole young person.",
			list: [
				{
					title: "Faith and Character",
					text: "Helping young people encounter Jesus Christ, understand the Word of God, develop strong values and grow into people of integrity, compassion and service.",
				},
				{
					title: "Education and Skills",
					text: "Equipping young people with critical thinking, creativity, effective learning, financial intelligence, entrepreneurship, AI and digital skills, and career awareness.",
				},
				{
					title: "Leadership and Mentorship",
					text: "Developing confident, ethical and transformational leaders through mentoring, role models, practical responsibility and opportunities to serve.",
				},
				{
					title: "Opportunity and Global Citizenship",
					text: "Connecting young people to networks, platforms and experiences that encourage social responsibility, cross-cultural learning and positive community impact.",
				},
			],
		},
		invitation: {
			title: "There Is a Place for You in This Vision",
			text: "Whether you are a young person, parent, school, church, volunteer, donor, philanthropist, corporate organisation or community leader, there is a place for you in this vision. Together, we can raise a generation of Daniels, Josephs, Esthers and Deborahs—young people of wisdom, courage, excellence, faith and influence.",
			imageUrl: "",
		},
		getInvolved: {
			title: "Get Involved",
			subtitle: "Partner with us in transforming the lives of young people for the glory of God.",
			list: [
				{ title: "Attend Our Events", text: "Join us at campus programs, conferences and revival meetings across High Schools and Tertiaries." },
				{ title: "Volunteer Your Time & Skills", text: "Provide knowledgeable speakers, facilitators, or subject matter experts to enrich our sessions." },
				{ title: "Support a Young Person", text: "Offer scholarships, mentorship or financial aid to deserving students who demonstrate exceptional potential." },
			],
		},
	},

	// --------------------------------------------------------------------
	// ABOUT
	// --------------------------------------------------------------------
	about: {
		whoWeAre: {
			title: "Who We Are",
			text: "Turn To Christ Commission and Streets of Gold Youth Conference—known collectively as TTC & SOGY—is a Christian youth empowerment and development movement operating under Turn To Christ Crusade, a Charitable Incorporated Organisation registered in England and Wales with charity number 1212685.\n\nWe combine Christian faith and discipleship with holistic youth development. Our work addresses the whole person: spiritual formation, academic growth, health and wellbeing, leadership, employability, entrepreneurship, financial capability, responsible citizenship and future-ready skills. Our programmes are welcoming, compassionate and internationally inclusive.",
			imageUrl: M("1787955708700-group.jpg"),
		},
		names: [
			{
				name: "Turn To Christ Commission (TTC)",
				text: "Turn To Christ Commission expresses our Christian mandate to share the Gospel of Jesus Christ, make disciples and help individuals and families build lives grounded in faith, hope and purpose.",
			},
			{
				name: "Streets of Gold Youth Conference (SOGY)",
				text: "Streets of Gold Youth Conference is our principal youth empowerment platform. It brings young people together for transformational teaching, mentorship, leadership development, creative expression, practical learning, Christian fellowship and global connection.",
			},
		],
		foundation: {
			title: "Our Biblical Foundation",
			verse:
				"The vision was birthed on 21 November 2020 while the founder was studying Acts 16:31: “Believe in the Lord Jesus, and you will be saved—you and your household.”",
			text: "Our youth development mandate is also inspired by Daniel 1:17, Daniel 1:20 and Daniel 6:3, which speak of God-given knowledge, wisdom and an excellent spirit.",
		},
		motto: {
			text: "“Let no one despise your youth, but be an example…”",
			ref: "1 Timothy 4:12",
		},
		identity: {
			title: "Our Identity Statement",
			text: "We are Christian in foundation, global in outlook, inclusive in service and transformational in purpose.",
		},
		history: {
			title: "Our History",
			subtitle: "From a vision birthed in 2020 to an international youth movement.",
			list: [
				{ date: "2020", title: "The Birth of the Vision", text: "The vision was birthed on 21 November 2020 through Acts 16:31, with a mandate to lead people and households to Christ." },
				{ date: "2021", title: "Building the Foundation", text: "The early period focused on prayer, vision development and establishing the foundations for a youth movement." },
				{ date: "2022", title: "Public Launch in Ghana", text: "TTC & SOGY was publicly launched on 22 October 2022 at Accra High School, hosting its inaugural Students Conference at the same school." },
				{ date: "2023–2024", title: "Expansion Across Schools & Communities", text: "Work expanded through school and community engagement across multiple Ghanaian institutions." },
				{ date: "2025", title: "Growing Impact", text: "The Students Campus Conference on 1 November 2025 at PRESEC Mampong carried the theme “The King of Glory”, reporting approximately 1,200 decisions for Christ." },
				{ date: "2026", title: "Five Years of Grace and Impact", text: "The Global Youth Empowerment Conference on 15 August 2026 ran under “Defy Despise; Live With Purpose”, connecting youth communities across Ghana, Zambia, the United States, the United Kingdom, Jamaica, Antigua and Barbuda, Uganda and India." },
			],
		},
		vision: {
			title: "Our Vision",
			text: "To see a globally connected generation of Christ-centred, purpose-driven, skilled and compassionate young leaders transforming communities, institutions and nations.",
			expanded:
				"We envision a world in which every young person—regardless of background, geography or economic circumstance—has the spiritual foundation, knowledge, mentorship, confidence and opportunity needed to fulfil their God-given potential.",
		},
		mission: {
			title: "Our Mission",
			text: "To evangelise, disciple, mentor, educate and empower young people through Christ-centred programmes that nurture spiritual growth, academic excellence, health and wellbeing, leadership, career development, entrepreneurship, financial intelligence, critical thinking, creativity, youth social responsibility, and AI and digital skills.",
			howWeDeliver: [
				"Sharing the Gospel and nurturing Christian discipleship",
				"Taking youth development programmes into schools, campuses, churches and communities",
				"Connecting young people with mentors, leaders, professionals and positive role models",
				"Teaching practical, relevant and future-ready skills",
				"Providing platforms for young people to speak, lead, create and collaborate",
				"Supporting wellbeing, confidence and responsible decision-making",
				"Building local and international partnerships that expand opportunity and impact",
			],
		},
		values: {
			title: "Our Core Values",
			subtitle: "The principles that guide everything we do.",
			list: [
				{ title: "Christ-Centred Faith", text: "Jesus Christ is the foundation of our identity, message and service." },
				{ title: "Integrity", text: "We act honestly, responsibly and transparently." },
				{ title: "Excellence", text: "We pursue high standards and responsible stewardship of every opportunity." },
				{ title: "Compassion", text: "We respond to young people's needs with empathy, dignity and practical care." },
				{ title: "Empowerment", text: "We equip young people to think, lead, create, serve and build sustainable futures." },
				{ title: "Inclusion and Respect", text: "We welcome people from diverse nations and backgrounds while remaining faithful to our Christian foundation." },
				{ title: "Innovation and Creativity", text: "We encourage bold thinking and responsible use of technology." },
				{ title: "Service and Social Responsibility", text: "We teach that leadership is service to families, communities and nations." },
				{ title: "Partnership", text: "We believe lasting transformation comes through cooperation." },
				{ title: "Accountability and Stewardship", text: "We measure our work responsibly and remain accountable to those we serve." },
			],
		},
		leadership: {
			title: "Leadership and Governance",
			subtitle: "Turn To Christ Crusade is governed by its trustees and led by its executive team.",
			text: "The trustees carry responsibility for the charity's strategic oversight, legal compliance, financial stewardship, safeguarding and accountability. The founder provides executive leadership for the delivery and development of the vision, while remaining accountable to the trustee body.",
			profiles: [
				{
					name: "Amb. Pastor Botsio Godsgift Appiah Bossman",
					role: "Founder & Executive Director",
					bio: "Founder of Turn To Christ Commission & Streets of Gold Youth Conference.",
					imageUrl: "",
				},
			],
		},
	},

	// --------------------------------------------------------------------
	// WHAT WE DO
	// --------------------------------------------------------------------
	whatWeDo: {
		intro: {
			title: "What We Do",
			text: "We run a range of programmes and projects that bring Christian faith and practical development together in the lives of young people.",
		},
		programs: {
			title: "Our Programmes & Projects",
			subtitle: "Fourteen ways we invest in the whole young person.",
			list: [
				{ title: "Streets of Gold Youth Conference", category: "conferences", text: "Our flagship youth empowerment platform bringing together young people, leaders, educators and mentors for teaching, discussion, prayer and practical development.", imageUrl: M("1787955828410-gos_preach.jpg") },
				{ title: "Students Campus Conference", category: "conferences", text: "Taking the mission directly to students through teaching, worship, mentoring and interactive learning.", imageUrl: M("1787955708700-group.jpg") },
				{ title: "School Outreach Programme", category: "outreach", text: "Age-appropriate Christian encouragement and holistic development sessions in schools.", imageUrl: M("1787955736423-loc.jpg") },
				{ title: "Campus Student Ambassadors Programme", category: "outreach", text: "Representing and promoting the vision within schools, mobilising students and modelling positive conduct.", imageUrl: M("1787955889158-why.jpg") },
				{ title: "Global Ambassadors Programme", category: "mentorship", text: "Respected leaders and professionals who advance the mission through influence, networks and expertise.", imageUrl: M("1787956164029-why.jpg") },
				{ title: "Leadership and Mentorship Programme", category: "mentorship", text: "Connecting young people with trusted leaders and positive role models.", imageUrl: M("1787955859808-ment.jpg") },
				{ title: "Entrepreneurship and Financial Intelligence", category: "skills", text: "Foundational concepts in enterprise, problem-solving, money management and responsible stewardship.", imageUrl: M("1787955837490-Ent.jpg") },
				{ title: "Critical Thinking and Creativity", category: "skills", text: "Learning to question, analyse, solve problems and communicate with wisdom and imagination.", imageUrl: M("1787955849165-Eff.jpg") },
				{ title: "AI, IT and Digital Skills Development", category: "skills", text: "Preparing young people for a technology-driven future through digital confidence and online safety.", imageUrl: M("1787955849165-Eff.jpg") },
				{ title: "Health and Wellbeing", category: "skills", text: "Promoting healthy choices and awareness of physical, mental, emotional and spiritual wellbeing.", imageUrl: M("1787955853356-Health.jpg") },
				{ title: "Youth Social Responsibility", category: "skills", text: "Encouraging service, compassion, citizenship and practical community action.", imageUrl: M("1787955889158-why.jpg") },
				{ title: "Word Dynamics and Christian Discipleship", category: "discipleship", text: "Scripture-based teaching, prayer, worship and mentoring toward a personal relationship with Christ.", imageUrl: M("1787955828410-gos_preach.jpg") },
				{ title: "Effective Learning and Career Guidance", category: "discipleship", text: "Strengthening study habits, exploring options and making informed decisions about the future.", imageUrl: M("1787955849165-Eff.jpg") },
				{ title: "Volunteers and Prayer Network", category: "discipleship", text: "Volunteers contributing skills, time and prayer across outreach, events and programme delivery.", imageUrl: M("1787955859808-ment.jpg") },
			],
		},
		learning: {
			title: "Our Learning Framework",
			subtitle: "A holistic curriculum designed to develop the whole young person.",
			list: [
				"Word Dynamics and Christian Discipleship",
				"Leadership and Mentorship",
				"Critical Thinking and Creativity",
				"Youth Social Responsibility",
				"Financial Intelligence",
				"Entrepreneurship",
				"Effective Learning Skills",
				"Career Guidance and Employability",
				"Health and Wellbeing",
				"AI, IT and Digital Skills",
				"Personal Development",
				"Wisdom, Character and Purpose",
			],
		},
	},

	// --------------------------------------------------------------------
	// IMPACT
	// --------------------------------------------------------------------
	impact: {
		intro: {
			title: "Our Impact",
			text: "Since the public launch of our programmes in 2022, we report reaching more than 13,000 young people in Ghana and the United Kingdom through outreach, conferences, mentorship, teaching and youth development activities.",
		},
		highlights: {
			title: "Impact Highlights",
			list: [
				{ label: "Young People Reached", value: "13,000+" },
				{ label: "Decisions for Christ (2025)", value: "≈1,200" },
				{ label: "Since", value: "2022" },
				{ label: "Countries Connected (2026)", value: "8+" },
			],
		},
		change: {
			title: "The Change We Seek",
			subtitle: "Measurable and lasting change in five areas.",
			list: [
				{ title: "Spiritual Growth", text: "Young people encounter Christ, understand Scripture and develop Christian character." },
				{ title: "Personal Development", text: "Young people gain confidence, self-awareness, resilience and a clear sense of purpose." },
				{ title: "Knowledge and Skills", text: "Young people acquire practical, academic, entrepreneurial, financial and digital capabilities." },
				{ title: "Leadership and Service", text: "Young people take responsibility, lead ethically and contribute to their communities." },
				{ title: "Opportunity and Progression", text: "Young people access mentors, networks, training and pathways that support education and employment." },
			],
		},
		additional: {
			title: "How Impact Extends Beyond Numbers",
			list: [
				"School and campus engagement across multiple Ghanaian institutions",
				"International participation in the 2026 Global Youth Empowerment Conference",
				"Youth-led presentations and cross-cultural learning opportunities",
				"Growing networks of Global Ambassadors, campus ambassadors and volunteers",
				"Certificates of attendance and participation recognising young people's commitment",
			],
		},
	},

	// --------------------------------------------------------------------
	// FUTURE
	// --------------------------------------------------------------------
	future: {
		institute: {
			title: "TTC Global Institute",
			text: "Our medium-term ambition is to establish TTC Global Institute: a Christian, non-denominational and internationally accessible learning institution dedicated to leadership, enterprise, character, technology and holistic human development.",
			areas: [
				"Christian Leadership and Mentorship",
				"Critical Thinking and Creativity",
				"Entrepreneurship and Innovation",
				"Financial Intelligence and Stewardship",
				"AI and Digital Skills Development",
				"Health and Wellbeing",
				"Youth and Community Development",
				"Youth Social Responsibility",
				"Effective Learning Skills",
				"Personal and Career Development",
				"Word Dynamics and Christian Discipleship",
			],
			outcome: "We aspire to build an institution that equips ethical, innovative and compassionate leaders for ministry, business, education, technology, public service and community transformation.",
		},
		talentHubs: {
			title: "TTC & SOGY Talent Hubs",
			text: "Our long-term ambition is to establish Talent Hubs in selected communities—accessible, youth-friendly centres providing a consistent environment for mentoring, learning, creativity, technology, enterprise and personal development.",
			services: [
				"Leadership and mentorship sessions",
				"Career guidance and employability support",
				"Entrepreneurship and financial intelligence training",
				"AI, IT and digital skills development",
				"Creative arts and talent development",
				"Effective learning and academic support",
				"Health and wellbeing education",
				"Christian discipleship and character formation",
				"Community service and social-action projects",
				"Access to positive role models, networks and opportunities",
			],
			why:
				"Conferences and online learning can inspire transformation; sustained community support helps embed it. Talent Hubs enable longer-term relationships with young people, track development and connect learning to real opportunities.",
		},
		threeYear: {
			title: "Our Three-Year Ambition",
			text: "Over the next three years, TTC & SOGY aims to move from periodic high-impact events toward a stronger, year-round youth development ecosystem.",
			list: [
				"Strengthen governance, safeguarding, financial accountability and impact measurement",
				"Expand structured school, campus and community programmes",
				"Develop TTC Global Institute through credible educational and strategic partnerships",
				"Develop a strong network of mentors, volunteers and ambassadors",
				"Increase youth participation in programme design and leadership",
				"Develop a consistent learning curriculum and digital resource platform",
				"Extend responsible international partnerships across Africa, the UK and beyond",
				"Build sustainable relationships with donors, churches, companies and foundations",
				"Lay foundations for future TTC & SOGY Talent Hubs",
			],
		},
		disclaimer:
			"TTC Global Institute and the Talent Hubs are future ambitions until formally established. Their development will be subject to funding, governance, facilities, staffing, partnerships and relevant regulatory or accreditation requirements.",
	},

	// --------------------------------------------------------------------
	// GET INVOLVED
	// --------------------------------------------------------------------
	getInvolved: {
		donate: {
			title: "Support Our Work",
			text: "Every donation contributes to the delivery and development of youth-focused activities. Depending on current priorities, support may help fund school and community outreach, youth conferences, training materials, mentorship, technology and programme quality.",
			buttons: ["Donate Now", "Become a Monthly Partner", "Sponsor a Project"],
			note: "Donations will be used in accordance with the charity's objects, applicable law and any properly accepted donor restriction.",
		},
		partner: {
			title: "Partner With Us",
			text: "Transforming young lives requires prayer, committed people, sustainable funding, professional expertise, safe spaces and long-term partnerships. By partnering with TTC & SOGY, you can help us reach young people with the Gospel and build pathways to opportunity.",
			ways: [
				"Make a one-off or recurring donation",
				"Sponsor a school outreach or youth conference",
				"Support the development of a Talent Hub",
				"Fund learning resources, technology or youth participation",
				"Provide professional mentoring or specialist training",
				"Become a corporate, church or community partner",
				"Volunteer your time, expertise or services",
				"Introduce TTC & SOGY to funders, foundations and strategic networks",
				"Pray for the vision, team, partners and young people",
			],
			benefits: [
				"Regular updates on programmes, milestones and impact",
				"Opportunities to participate in selected events and initiatives",
				"Recognition at events and, where appropriate, on our website and social media",
				"Weekly prayer and special monthly prayer for partners",
				"Opportunities for staff volunteering, mentoring and community engagement",
			],
		},
		volunteer: {
			title: "Volunteer With Us",
			text: "Our volunteers help turn vision into action. Opportunities may be available in mentoring, administration, prayer, events, communications, fundraising, technology, teaching, media, research and community outreach.",
			note: "Volunteers are expected to uphold our Christian ethos, follow safeguarding and conduct requirements and complete any relevant checks or training required for their role.",
			cta: "Express Your Interest",
		},
		ambassadors: {
			title: "Global Ambassadors",
			text: "TTC & SOGY Global Ambassadors are distinguished individuals who believe in the potential of young people and are willing to champion the mission locally and internationally.",
			list: [
				"Promote the vision and increase awareness",
				"Mentor or inspire young people",
				"Connect the charity to partners, funders and institutions",
				"Support international participation and collaboration",
				"Represent TTC & SOGY at appropriate events",
				"Contribute expertise, prayer, advocacy and strategic insight",
			],
		},
		whyItMatters: {
			title: "Why Our Work Matters",
			text: "Young people face pressures relating to identity, faith, education, employment, technology, mental wellbeing, finances and relationships. TTC & SOGY responds by combining spiritual foundation with practical preparation—equipping young people, not limiting them.",
		},
	},

	// --------------------------------------------------------------------
	// CONTACT + FAQ
	// --------------------------------------------------------------------
	contact: {
		title: "Let Us Build the Future Together",
		subtitle: "We would be delighted to hear from young people, parents, schools, churches, community organisations, volunteers, donors, corporate partners and institutions that share our passion for youth transformation.",
		categories: [
			"General Enquiry",
			"School or Church Partnership",
			"Volunteer or Mentor Enquiry",
			"Global Ambassador Enquiry",
			"Donations and Corporate Partnerships",
			"Media and Speaking Enquiry",
			"Safeguarding Concern",
		],
		email: "turntochristcrusade@gmail.com",
		phones: [
			{ label: "Holland", value: "+31 6 34299126" },
			{ label: "UK", value: "+44 7568 570759" },
			{ label: "GH", value: "+233 24 046 0783" },
			{ label: "USA", value: "+1 (432) 232-8931" },
		],
		website: "sogyconf.org",
		charityName: "Turn To Christ Crusade",
		charityNumber: "1212685",
	},

	faq: {
		title: "Frequently Asked Questions",
		qa: [
			{ q: "Is TTC & SOGY a registered charity?", a: "Yes. TTC & SOGY operates under the registered legal name Turn To Christ Crusade, a Charitable Incorporated Organisation registered in England and Wales with charity number 1212685." },
			{ q: "Is TTC & SOGY only for Christians?", a: "TTC & SOGY is founded on the Christian faith and its programmes reflect Christian values and teaching. We are committed to serving young people with dignity and respect and to creating welcoming, internationally inclusive environments." },
			{ q: "Where do you work?", a: "Our principal programme history is in Ghana and the United Kingdom, with international relationships and participation involving other countries. Expansion is undertaken progressively through appropriate local partnerships and safeguarding arrangements." },
			{ q: "What age group do you support?", a: "Our programmes serve young people, students and emerging young leaders. The precise age range may vary by programme, institution and safeguarding requirements." },
			{ q: "How can my school or church become involved?", a: "Schools, churches and community organisations can contact us to discuss outreach, workshops, conferences, mentoring, youth ambassador opportunities or strategic partnership." },
			{ q: "How can I become a volunteer or mentor?", a: "Complete the expression-of-interest form on our website. Suitable applicants may be invited to a conversation and required to complete references, training and safeguarding checks appropriate to the role." },
			{ q: "How can I support financially?", a: "You can make a one-off gift, become a monthly partner, sponsor a project or discuss a strategic partnership with our team." },
			{ q: "Are the Talent Hubs and TTC Global Institute already operating?", a: "They form part of our medium- and long-term development vision. Their implementation will depend on funding, governance, facilities, staffing, partnerships and relevant regulatory or accreditation requirements." },
		],
	},

	// --------------------------------------------------------------------
	// SHARED
	// --------------------------------------------------------------------
	founder: {
		title: "A Message from the Founder",
		text: "This vision was birthed from Acts 16:31 on 21 November 2020 with a burden to see individuals and households turn to Christ and to raise a generation of young people who are spiritually grounded, intellectually equipped and prepared to lead.\n\nI believe there is greatness within every young person. With faith, mentorship, education, opportunity and the right environment, they can rise above limitation and become transformational leaders in their families, communities and nations.\n\nOur calling is to raise Daniels, Josephs, Esthers and Deborahs—young people of wisdom, courage, integrity, creativity and an excellent spirit.",
		name: "Amb. Pastor Botsio Godsgift Appiah Bossman",
		role: "Founder & Executive Director",
		imageUrl: "",
	},

	shared: {
		tagline: "Empowered by Faith. Equipped for the Future.",
		footerText:
			"We invest in the whole young person—spirit, mind, character and potential. TTC & SOGY helps young people move from vulnerability and limited opportunity towards purpose, confidence, leadership and positive social impact.",
		charityNumber: "1212685",
	},
};
