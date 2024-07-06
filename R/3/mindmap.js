const resumeData = {
    "name": "Krishna Kanth B",
    "children": [
        {
            "name": "Education",
            "children": [
                { "name": "Vellore Institute of Technology", "details": "Master's degree in Biotechnology, 8.62 CGPA, 2011 - 2013" },
                { "name": "University Of Madras", "details": "Bachelor's degree in Biotechnology, 62.80%, 2007 - 2010" }
            ]
        },
        {
            "name": "Work Experience",
            "children": [
                { "name": "PowerSchool (GlowTouch)", "details": "Technical Support Engineer Specialist, Sep 2022 - Oct 2023, Mangalore" },
                { "name": "Amazon", "details": "Management Information Systems, Jul 2020 - Aug 2021, Chennai" },
                { "name": "Optum", "details": "Strategic Analyst, May 2017 - Jan 2019, Chennai" },
                { "name": "Johnson & Johnson (GVW Technologies)", "details": "Analyst Level I, II & III, Mar 2015 - Feb 2017, Chennai" },
                { "name": "Premier Inc. (Medusind Solutions)", "details": "Content Analyst, Dec 2013 - Feb 2015, Chennai" },
                { "name": "Dell", "details": "Customer Care Voice Sr. Rep, Jul 2013 - Dec 2013, Chennai" },
                { "name": "Symantec", "details": "Product Support Analyst, Apr 2011 - Jul 2011, Chennai" },
                { "name": "Sitel India", "details": "Customer Service Professional, Sep 2010 - Mar 2011, Chennai" }
            ]
        },
        {
            "name": "Skills",
            "children": [
                { "name": "SQL", "details": "Querying- Stored Procedures- Database Functions, SSMS, MySQL, Aqua Data, SnowFlake" },
                { "name": "Data Visualization & Reporting", "details": "Tableau, Spotfire, Excel Dashboards, Looker, PowerBI" },
                { "name": "Microsoft Excel", "details": "Analysis, Reporting, Formulas, Advanced Techniques, Macros" },
                { "name": "Labware LIMS", "details": "Laboratory Information Management Systems" },
                { "name": "Soft Skills", "details": "Telephonic Communication, E-mail Etiquette, Facilitation, Presentation, Creativity, Innovation, Problem-solving, Critical thinking, Conflict Resolution" }
            ]
        },
        {
            "name": "Awards",
            "children": [
                { "name": "Accolade – Bravo for Ownership", "details": "Amazon - Mar 2021" },
                { "name": "Best Hackathon Project", "details": "Optum - Mar 2018" }
            ]
        }
    ]
};

const width = 960;
const height = 600;

const svg = d3.select("#mindmap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");

const tree = d3.tree().size([height, width - 160]);
const stratify = d3.stratify()
    .parentId(d => d.id.substring(0, d.id.lastIndexOf(".")));

const root = d3.hierarchy(resumeData);

tree(root);

const link = svg.selectAll(".link")
    .data(root.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .attr("d", d => `M${d.y},${d.x}C${d.parent.y + 100},${d.x},${d.parent.y + 100},${d.parent.x},${d.parent.y},${d.parent.x}`);

const node = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", d => `node${d.children ? " node--internal" : " node--leaf"}`)
    .attr("transform", d => `translate(${d.y},${d.x})`);

node.append("circle")
    .attr("r", 10);

node.append("text")
    .attr("dy", 3)
    .attr("x", d => d.children ? -12 : 12)
    .style("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name);

node.on("click", function(event, d) {
    alert(d.data.details);
});
