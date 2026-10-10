---
{
  "title": "Song Popularity Predictor",
  "status": "EXPERIMENTAL",
  "technologies": [
    "Python",
    "Linear Regression",
    "Pandas",
    "scikit-learn"
  ],
  "description": "I got curious about what makes songs popular, so I built a model to predict it. Used linear regression on Spotify data (plus synthetic variations) to see which features matter most. Simple project, fun to see what the numbers said about hit songs.",
  "links": {
    "github": "https://github.com/Muhsiinn/Song-Popularity-Predictor-"
  }
}
---

Implimented Linear Regreassion on Spotify data set 
Built using the Top Spotify Songs 2023 dataset from Kaggle. Started with 953 real songs, then created synthetic variations by scaling features down to simulate less popular tracks. This gave us different popularity tiers for training.

The data is pretty scarce though. Would be cool to train this on way more real songs instead of having to make synthetic ones. Like maybe thousands of songs from different years and popularity levels. Right now I'm just working with what I got.
