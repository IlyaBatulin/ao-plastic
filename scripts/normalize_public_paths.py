from __future__ import annotations

import csv
import os
import re
import shutil
from pathlib import Path
from typing import Dict, List, Tuple


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"

TEXT_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".md",
    ".mjs",
    ".cjs",
    ".css",
    ".scss",
    ".txt",
    ".yml",
    ".yaml",
}

SKIP_DIRS = {".git", "node_modules", ".next"}

CYRILLIC_MAP = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "e",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "h",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "sch",
    "ъ": "",
    "ы": "y",
    "ь": "",
    "э": "e",
    "ю": "yu",
    "я": "ya",
}


def transliterate(value: str) -> str:
    chars: List[str] = []
    for ch in value:
        low = ch.lower()
        if low in CYRILLIC_MAP:
            chars.append(CYRILLIC_MAP[low])
        else:
            chars.append(ch)
    return "".join(chars)


def slugify(value: str) -> str:
    value = transliterate(value)
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "file"


def normalize_dirname(name: str) -> str:
    return slugify(name)


def normalize_filename(name: str) -> str:
    stem, ext = os.path.splitext(name)
    new_stem = slugify(stem)
    if ext:
        safe_ext = re.sub(r"[^a-z0-9]", "", ext.lower().lstrip("."))
        if not safe_ext:
            return new_stem
        return f"{new_stem}.{safe_ext}"
    return new_stem


def uniquify_names(raw_to_norm: Dict[str, str]) -> Dict[str, str]:
    result: Dict[str, str] = {}
    used: Dict[str, int] = {}
    for raw_name in sorted(raw_to_norm.keys()):
        base = raw_to_norm[raw_name]
        candidate = base
        counter = 2
        while candidate in used:
            stem, ext = os.path.splitext(base)
            candidate = f"{stem}-{counter}{ext}"
            counter += 1
        used[candidate] = 1
        result[raw_name] = candidate
    return result


def collect_tree() -> Tuple[Dict[str, List[str]], Dict[str, List[str]], List[str]]:
    child_dirs: Dict[str, List[str]] = {}
    child_files: Dict[str, List[str]] = {}
    all_files: List[str] = []
    for dirpath, dirnames, filenames in os.walk(PUBLIC_DIR):
        abs_dir = Path(dirpath)
        rel_dir = abs_dir.relative_to(PUBLIC_DIR).as_posix()
        rel_dir = "" if rel_dir == "." else rel_dir
        child_dirs[rel_dir] = sorted(dirnames)
        child_files[rel_dir] = sorted(filenames)
        for filename in filenames:
            rel_file = f"{rel_dir}/{filename}" if rel_dir else filename
            all_files.append(rel_file)
    return child_dirs, child_files, sorted(all_files)


def build_name_maps(
    child_dirs: Dict[str, List[str]], child_files: Dict[str, List[str]]
) -> Tuple[Dict[Tuple[str, str], str], Dict[Tuple[str, str], str]]:
    dir_map: Dict[Tuple[str, str], str] = {}
    file_map: Dict[Tuple[str, str], str] = {}

    for parent, names in child_dirs.items():
        base_map = {name: normalize_dirname(name) for name in names}
        unique_map = uniquify_names(base_map)
        for old_name, new_name in unique_map.items():
            dir_map[(parent, old_name)] = new_name

    for parent, names in child_files.items():
        base_map = {name: normalize_filename(name) for name in names}
        unique_map = uniquify_names(base_map)
        for old_name, new_name in unique_map.items():
            file_map[(parent, old_name)] = new_name

    return dir_map, file_map


def to_new_file_rel(
    old_file_rel: str,
    dir_map: Dict[Tuple[str, str], str],
    file_map: Dict[Tuple[str, str], str],
) -> str:
    path = Path(old_file_rel)
    dir_parts = list(path.parts[:-1])
    file_name = path.parts[-1]

    old_parent = ""
    new_parts: List[str] = []
    for old_dir_name in dir_parts:
        new_dir_name = dir_map[(old_parent, old_dir_name)]
        new_parts.append(new_dir_name)
        old_parent = f"{old_parent}/{old_dir_name}" if old_parent else old_dir_name

    new_file_name = file_map[(old_parent, file_name)]
    new_rel = "/".join(new_parts + [new_file_name]) if new_parts else new_file_name
    return new_rel


def move_files(mapping: Dict[str, str]) -> None:
    for old_rel, new_rel in sorted(mapping.items(), key=lambda item: len(item[0]), reverse=True):
        old_abs = PUBLIC_DIR / old_rel
        new_abs = PUBLIC_DIR / new_rel
        if old_abs == new_abs:
            continue
        if not old_abs.exists():
            continue
        new_abs.parent.mkdir(parents=True, exist_ok=True)
        if new_abs.exists():
            continue
        shutil.move(str(old_abs), str(new_abs))


def cleanup_empty_dirs() -> None:
    for dirpath, _, _ in os.walk(PUBLIC_DIR, topdown=False):
        path = Path(dirpath)
        if path == PUBLIC_DIR:
            continue
        try:
            path.rmdir()
        except OSError:
            pass


def replace_paths_in_text_files(path_map: Dict[str, str]) -> Tuple[int, int]:
    replacements = []
    for old_rel, new_rel in path_map.items():
        old_url = "/" + old_rel.replace("\\", "/")
        new_url = "/" + new_rel.replace("\\", "/")
        if old_url != new_url:
            replacements.append((old_url, new_url))

    replacements.sort(key=lambda pair: len(pair[0]), reverse=True)

    changed_files = 0
    changed_refs = 0

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for filename in filenames:
            path = Path(dirpath) / filename
            if path.suffix.lower() not in TEXT_EXTENSIONS:
                continue

            try:
                original = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue

            updated = original
            file_hits = 0
            for old, new in replacements:
                if old in updated:
                    hits = updated.count(old)
                    updated = updated.replace(old, new)
                    file_hits += hits

            if updated != original:
                path.write_text(updated, encoding="utf-8", newline="")
                changed_files += 1
                changed_refs += file_hits

    return changed_files, changed_refs


def write_mapping_csv(path_map: Dict[str, str]) -> Path:
    docs_dir = ROOT / "docs"
    docs_dir.mkdir(parents=True, exist_ok=True)
    out_file = docs_dir / "media-path-migration.csv"
    with out_file.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["old_public_path", "new_public_path"])
        for old_rel in sorted(path_map.keys()):
            writer.writerow(["/" + old_rel, "/" + path_map[old_rel]])
    return out_file


def main() -> None:
    child_dirs, child_files, all_files = collect_tree()
    dir_map, file_map = build_name_maps(child_dirs, child_files)

    file_path_map: Dict[str, str] = {}
    for old_file in all_files:
        new_file = to_new_file_rel(old_file, dir_map, file_map)
        file_path_map[old_file] = new_file

    renamed_files = sum(1 for old, new in file_path_map.items() if old != new)

    move_files(file_path_map)
    cleanup_empty_dirs()

    changed_files, changed_refs = replace_paths_in_text_files(file_path_map)
    csv_path = write_mapping_csv(file_path_map)

    print(f"files_total={len(file_path_map)}")
    print(f"files_renamed={renamed_files}")
    print(f"text_files_updated={changed_files}")
    print(f"path_replacements={changed_refs}")
    print(f"mapping_csv={csv_path}")


if __name__ == "__main__":
    main()
