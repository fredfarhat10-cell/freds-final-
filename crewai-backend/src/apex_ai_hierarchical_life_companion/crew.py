from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
from langchain_openai import ChatOpenAI

@CrewBase
class ApexAiHierarchicalLifeCompanion:
    """Apex AI Hierarchical Life Companion crew for financial intelligence"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
        self.search_tool = SerperDevTool()
        self.scrape_tool = ScrapeWebsiteTool()

    @agent
    def jarvis_financial_intelligence_specialist(self) -> Agent:
        """
        Financial Intelligence Specialist Agent
        Expert in market analysis, fundamental research, and investment recommendations
        """
        return Agent(
            config=self.agents_config['jarvis_financial_intelligence_specialist'],
            tools=[self.search_tool, self.scrape_tool],
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

    @agent
    def market_data_analyst(self) -> Agent:
        """
        Market Data Analyst Agent
        Specializes in technical analysis and market trends
        """
        return Agent(
            config=self.agents_config['market_data_analyst'],
            tools=[self.search_tool, self.scrape_tool],
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

    @agent
    def news_sentiment_analyst(self) -> Agent:
        """
        News & Sentiment Analyst Agent
        Analyzes news, social media, and market sentiment
        """
        return Agent(
            config=self.agents_config['news_sentiment_analyst'],
            tools=[self.search_tool, self.scrape_tool],
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

    @task
    def gather_market_data_task(self) -> Task:
        """Task to gather comprehensive market data for a ticker"""
        return Task(
            config=self.tasks_config['gather_market_data'],
            agent=self.market_data_analyst()
        )

    @task
    def analyze_news_sentiment_task(self) -> Task:
        """Task to analyze news and sentiment for a ticker"""
        return Task(
            config=self.tasks_config['analyze_news_sentiment'],
            agent=self.news_sentiment_analyst()
        )

    @task
    def generate_alpha_brief_task(self) -> Task:
        """Task to generate comprehensive Alpha Brief"""
        return Task(
            config=self.tasks_config['generate_alpha_brief'],
            agent=self.jarvis_financial_intelligence_specialist(),
            context=[self.gather_market_data_task(), self.analyze_news_sentiment_task()]
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Apex AI Financial Intelligence crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )
