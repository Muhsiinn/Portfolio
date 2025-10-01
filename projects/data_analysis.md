# Austrian Food Price Analysis & Email Automation

This was one of my first proper data projects. I wanted to see how food prices in Austria changed over time, so I compared the Producer Price Index (PPI) with the Consumer Price Index (CPI).

I used Python with NumPy and Pandas to clean up the messy CSV files, align the years, and calculate the “gap” between producer and consumer prices. Then I made some plots to see how the gap changed over the years (spoiler: it really widened after 2010).

On top of that, I added a small email automation script: it takes the latest plots and summary data and sends them out automatically. Nothing fancy, but it showed me how to mix data analysis with a bit of practical automation.

### What I did

Cleaned and transformed raw data with Pandas/NumPy.

Normalized values and calculated producer vs consumer price gaps.

Made simple time-series plots to spot trends.

Wrote a Python script to automatically email results (charts + CSV).

### What I learned

How to properly clean and align datasets.

How simple normalization can help compare two different indices.

Basics of automating tasks with Python (sending emails with attachments).