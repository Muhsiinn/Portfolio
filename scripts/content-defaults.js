const path = require('node:path');

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function stripFrontMatter(source = '') {
  return String(source).replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, '');
}

function stripCodeBlocks(source = '') {
  return String(source).replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '');
}

function plainText(value = '') {
  return String(value)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) return value;
  const part = value.slice(0, maxLength - 1);
  const boundary = part.lastIndexOf(' ');
  return (boundary > 40 ? part.slice(0, boundary) : part).trim() + '…';
}

function firstHeading(source) {
  const body = stripCodeBlocks(stripFrontMatter(source));
  const match = body.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/m);
  return match ? plainText(match[1]) : '';
}

function firstParagraph(source) {
  const body = stripCodeBlocks(stripFrontMatter(source));
  for (const block of body.split(/\r?\n\s*\r?\n/)) {
    const text = block.trim();
    if (!text) continue;
    if (/^(#{1,6}\s|>|[-*+]\s|\d+\.\s|\||!\[|\$\$|<)/.test(text)) continue;
    const plain = plainText(text);
    if (plain) return truncate(plain, 180);
  }
  return '';
}

function titleFromSlug(slug = '') {
  return String(slug)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase()) || 'Untitled';
}

function normalizeDate(value) {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

function dateFromFile(inputPath = '') {
  const name = path.basename(String(inputPath), path.extname(String(inputPath)));
  return /^\d{4}-\d{2}-\d{2}$/.test(name) ? name : '';
}

function dailyTitle(date) {
  if (!date) return 'Daily note';
  const [year, month, day] = date.split('-').map(Number);
  return day + ' ' + MONTHS[month - 1] + ' ' + year;
}

function rawInput(data) {
  return data.page && data.page.rawInput ? data.page.rawInput : '';
}

function resolveTitle(data) {
  if (data.title !== undefined && data.title !== null && String(data.title).trim()) return String(data.title).trim();
  const heading = firstHeading(rawInput(data));
  if (heading) return heading;
  return titleFromSlug(data.page && data.page.fileSlug);
}

function resolveDescription(data) {
  if (data.description !== undefined && data.description !== null && String(data.description).trim()) return String(data.description).trim();
  return firstParagraph(rawInput(data));
}

function resolveDate(data) {
  return normalizeDate(data.date) || dateFromFile(data.page && data.page.inputPath) || normalizeDate(data.page && data.page.date);
}

function resolveDailyDate(data) {
  return dateFromFile(data.page && data.page.inputPath) || normalizeDate(data.date) || normalizeDate(data.page && data.page.date);
}

function resolveDailyTitle(data) {
  if (data.title !== undefined && data.title !== null && String(data.title).trim()) return String(data.title).trim();
  const date = resolveDailyDate(data);
  if (date) return dailyTitle(date);
  return firstHeading(rawInput(data)) || 'Daily note';
}

function normalizeTags(value) {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return items.map((tag) => String(tag).trim()).filter(Boolean);
}

function entryData({ type, permalink, layout = 'layouts/entry.njk', daily = false }) {
  const production = () => process.env.ELEVENTY_ENV === 'production';
  return {
    type,
    eleventyComputed: {
      title: (data) => daily ? resolveDailyTitle(data) : resolveTitle(data),
      description: (data) => resolveDescription(data),
      date: (data) => daily ? resolveDailyDate(data) : resolveDate(data),
      tags: (data) => normalizeTags(data.tags),
      layout: (data) => data.draft && production() ? false : layout,
      permalink: (data) => data.draft && production() ? false : data.legacyPermalink || permalink(data),
      pageTitle: (data) => (daily ? resolveDailyTitle(data) : resolveTitle(data)) + ' — Muhsin\'s notebook'
    }
  };
}

module.exports = {
  entryData,
  firstHeading,
  firstParagraph,
  normalizeDate,
  normalizeTags,
  resolveDailyDate,
  resolveDate,
  resolveDescription,
  resolveTitle,
  titleFromSlug
};
