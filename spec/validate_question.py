#!/usr/bin/env python3
# Tested with Python 2.7 and 3.5

from __future__ import print_function
import argparse
import os
import sys
import yamale


def find_question_files(root_directory):
    """Yield all YAML files recursively."""
    for root, dirs, files in os.walk(root_directory):
        for basename in filter(lambda s: s.endswith((".yaml", ".yml")), files):
            yield os.path.join(root, basename)


def validate(schema_filename, data_filename):
    """Validate a YAML file according to the supplied schema."""
    schema = yamale.make_schema(schema_filename)
    data = yamale.make_data(data_filename)

    try:
        print("")
        print("Checking file '{}'...".format(data_filename))
        yamale.validate(schema, data)
        print("Everything ok.")
        return 0
    except ValueError as err:
        print("Invalid data. Yamale says:")
        print(err)
        print("")
        print("Probable error cause:")
        print(str(err).splitlines()[-1])
        return 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog='Validate web quiz questions')
    parser.add_argument('schema', type=str, help='path to the schema')
    parser.add_argument('path', type=str,
                        help='question file or a directory with files to be validated')
    args = parser.parse_args()

    if os.path.isfile(args.path):
        sys.exit(validate(args.schema, args.path))
    elif os.path.isdir(args.path):
        # Use eager evaluation here, otherwise program exits on first invalid file
        exit_codes = [validate(args.schema, d) for d in find_question_files(args.path)]
        if all(ec == 0 for ec in exit_codes):
            sys.exit(0)
        else:
            sys.exit(1)
    else:
        print("Invalid data filename.")
        sys.exit(1)
